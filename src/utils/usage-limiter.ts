/**
 * Usage Limiter - Tracks and limits AI feature usage
 * Uses Supabase for persistent storage with browser fingerprint for anonymous users
 */

import { supabase, isSupabaseConfigured } from './supabase'

// Constants
const MAX_ANONYMOUS_USAGE = 2
const MAX_FREE_USAGE = 5
const MAX_FILES_ANONYMOUS = 50
const MAX_FILES_FREE = 100
const FINGERPRINT_KEY = 'bru_fingerprint'

// Generate simple browser fingerprint
function generateFingerprint(): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillText('BRU fingerprint', 2, 2)
    }

    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
    ].join('|')

    // Simple hash
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return Math.abs(hash).toString(36) + Date.now().toString(36)
}

// Get or create fingerprint
function getFingerprint(): string {
    let fp = localStorage.getItem(FINGERPRINT_KEY)
    if (!fp) {
        fp = generateFingerprint()
        localStorage.setItem(FINGERPRINT_KEY, fp)
    }
    return fp
}

// Get or create anonymous user in Supabase
async function getOrCreateAnonymousUser(): Promise<string | null> {
    if (!isSupabaseConfigured() || !supabase) return null

    const fingerprint = getFingerprint()

    try {
        // Check if user exists
        const { data: existing } = await supabase
            .from('anonymous_users')
            .select('id')
            .eq('fingerprint', fingerprint)
            .single()

        if (existing) {
            // Update last seen
            await supabase
                .from('anonymous_users')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', existing.id)
            return existing.id
        }

        // Create new anonymous user
        const { data: newUser, error } = await supabase
            .from('anonymous_users')
            .insert({ fingerprint })
            .select('id')
            .single()

        if (error) {
            console.error('[UsageLimiter] Failed to create anonymous user:', error)
            return null
        }

        return newUser?.id || null
    } catch (err) {
        console.error('[UsageLimiter] Error:', err)
        return null
    }
}

export type FeatureType = 'rename' | 'organize'

export interface UsageCheckResult {
    allowed: boolean
    reason: string
    remainingCount: number
    maxFiles: number
}

/**
 * Check if user can use a feature
 */
export async function checkUsage(
    featureType: FeatureType,
    fileCount: number
): Promise<UsageCheckResult> {
    // If Supabase not configured, use local check logic
    // This ensures the limits work even for users who haven't set up Supabase
    if (!isSupabaseConfigured() || !supabase) {
        return localUsageCheck(featureType, fileCount)
    }

    const anonymousId = await getOrCreateAnonymousUser()

    if (!anonymousId) {
        // If we can't get an ID (e.g. network error), fallback to local
        return localUsageCheck(featureType, fileCount)
    }

    try {
        // Use the check_usage_limit function from Supabase
        const { data, error } = await supabase
            .rpc('check_usage_limit', {
                p_anonymous_id: anonymousId,
                p_feature_type: featureType,
                p_file_count: fileCount
            })

        if (error || !data || data.length === 0) {
            console.error('[UsageLimiter] RPC error:', error)
            return await localUsageCheck(featureType, fileCount)
        }

        const result = data[0]
        return {
            allowed: result.allowed,
            reason: result.reason,
            remainingCount: result.remaining_count,
            maxFiles: result.max_files
        }
    } catch (err) {
        console.error('[UsageLimiter] Check failed:', err)
        return await localUsageCheck(featureType, fileCount)
    }
}

// Fallback local check if RPC fails or Supabase not configured
async function localUsageCheck(
    featureType: FeatureType,
    fileCount: number
): Promise<UsageCheckResult> {
    // Use localStorage for simple local tracking
    // Key format: bru_usage_YYYY-MM-DD_feature
    const today = new Date().toISOString().split('T')[0]
    const key = `bru_usage_${today}_${featureType}`
    const usageCount = parseInt(localStorage.getItem(key) || '0', 10)

    const remaining = MAX_ANONYMOUS_USAGE - usageCount

    if (remaining <= 0) {
        return {
            allowed: false,
            reason: 'Daily usage limit reached. Support us on Buy Me a Coffee for unlimited access!',
            remainingCount: 0,
            maxFiles: MAX_FILES_ANONYMOUS
        }
    }

    if (fileCount > MAX_FILES_ANONYMOUS) {
        return {
            allowed: false,
            reason: `File limit exceeded. Max ${MAX_FILES_ANONYMOUS} files allowed. Support us for higher limits!`,
            remainingCount: remaining,
            maxFiles: MAX_FILES_ANONYMOUS
        }
    }

    return {
        allowed: true,
        reason: 'OK',
        remainingCount: remaining,
        maxFiles: MAX_FILES_ANONYMOUS
    }
}

/**
 * Record a successful usage
 */
export async function recordUsage(
    featureType: FeatureType,
    fileCount: number
): Promise<boolean> {
    // Always record locally as backup/offline support
    const today = new Date().toISOString().split('T')[0]
    const key = `bru_usage_${today}_${featureType}`
    const current = parseInt(localStorage.getItem(key) || '0', 10)
    localStorage.setItem(key, (current + 1).toString())

    if (!isSupabaseConfigured() || !supabase) return true

    const anonymousId = await getOrCreateAnonymousUser()
    if (!anonymousId) return true

    try {
        const { error } = await supabase
            .from('usage_logs')
            .insert({
                anonymous_id: anonymousId,
                feature_type: featureType,
                file_count: fileCount,
                success: true
            })

        if (error) {
            console.error('[UsageLimiter] Failed to record usage:', error)
            return false
        }

        return true
    } catch (err) {
        console.error('[UsageLimiter] Record error:', err)
        return false
    }
}

/**
 * Get remaining usage for display
 */
export async function getRemainingUsage(): Promise<{ rename: number; organize: number }> {
    // If Supabase not configured, use local storage
    if (!isSupabaseConfigured() || !supabase) {
        const today = new Date().toISOString().split('T')[0]

        const renameKey = `bru_usage_${today}_rename`
        const organizeKey = `bru_usage_${today}_organize`

        const renameUsage = parseInt(localStorage.getItem(renameKey) || '0', 10)
        const organizeUsage = parseInt(localStorage.getItem(organizeKey) || '0', 10)

        return {
            rename: Math.max(0, MAX_ANONYMOUS_USAGE - renameUsage),
            organize: Math.max(0, MAX_ANONYMOUS_USAGE - organizeUsage)
        }
    }

    const anonymousId = await getOrCreateAnonymousUser()
    if (!anonymousId) {
        // Fallback to local
        const today = new Date().toISOString().split('T')[0]
        const renameUsage = parseInt(localStorage.getItem(`bru_usage_${today}_rename`) || '0', 10)
        const organizeUsage = parseInt(localStorage.getItem(`bru_usage_${today}_organize`) || '0', 10)
        return {
            rename: Math.max(0, MAX_ANONYMOUS_USAGE - renameUsage),
            organize: Math.max(0, MAX_ANONYMOUS_USAGE - organizeUsage)
        }
    }

    try {
        // Use RPC to get accurate counts (bypass RLS which blocks direct SELECT for anon)
        const [renameResult, organizeResult] = await Promise.all([
            supabase.rpc('check_usage_limit', {
                p_anonymous_id: anonymousId,
                p_feature_type: 'rename',
                p_file_count: 0
            }),
            supabase.rpc('check_usage_limit', {
                p_anonymous_id: anonymousId,
                p_feature_type: 'organize',
                p_file_count: 0
            })
        ])

        const renameRemaining = (renameResult.data && renameResult.data[0])
            ? renameResult.data[0].remaining_count
            : MAX_ANONYMOUS_USAGE

        const organizeRemaining = (organizeResult.data && organizeResult.data[0])
            ? organizeResult.data[0].remaining_count
            : MAX_ANONYMOUS_USAGE

        return {
            rename: Math.max(0, renameRemaining),
            organize: Math.max(0, organizeRemaining)
        }
    } catch (err) {
        console.error('[UsageLimiter] Failed to get usage:', err)
        // Fallback to local on error
        const today = new Date().toISOString().split('T')[0]
        const renameUsage = parseInt(localStorage.getItem(`bru_usage_${today}_rename`) || '0', 10)
        const organizeUsage = parseInt(localStorage.getItem(`bru_usage_${today}_organize`) || '0', 10)
        return {
            rename: Math.max(0, MAX_ANONYMOUS_USAGE - renameUsage),
            organize: Math.max(0, MAX_ANONYMOUS_USAGE - organizeUsage)
        }
    }
}

export const LIMITS = {
    MAX_ANONYMOUS_USAGE,
    MAX_FREE_USAGE,
    MAX_FILES_ANONYMOUS,
    MAX_FILES_FREE
}
