const template = `// Customize your renaming JavaScript code here
/**
  * Parameter Description: options, an object containing information about a single file,
  * name(string): File name, by default, does not include the extension, if "Also Process Extension" is checked, it includes the extension.
  * nameWithoutExt(string): File name without the extension.
  * extension(string): File extension, including "."
  * modifyTime(number): File modification time, in milliseconds timestamp.
  * size(number): File size, in bytes.
  * index(number): Index of the file displayed in the table.
  *
  * Return Value: New file name (string), returning an empty value will skip the renaming operation.
  * Note: By default, it should return the file name without the extension. If "Also Process Extension" is checked, return the file name with the extension.
 */
 function rename(options){
   const {name, nameWithoutExt, extension, modifyTime, size, index} = options
   // your code here. Tips: If the logic is complex, it's recommended to complete it in VSCode and then copy and paste it here.
   return name
 }
 
 /**
  * Security Declaration
  * This website is a static site, all operations are performed locally, there is no server, and your data is not collected.
  * However, if you use insecure custom renaming code, it may lead to data leakage.
  * If you use custom renaming code provided by others, please verify the security of the code.
  * Secure code should only contain string processing logic for file names.
 */
 
 /*
 AI Prompt
 If you want to use AI to complete custom renaming operations, here is a prompt for reference.
 Replace the content within angle brackets <> with your specific requirements and examples.
 
 
 I am using JavaScript to batch rename files and have completed the basic functionality. Please complete the renaming function according to the requirements.
 Requirement 1: <Describe the requirement accurately; for example, add a serial number at the beginning of the file name, pad it to three digits, and add a space after the serial number>
 Requirement 1 Reference Example: <Change abc.txt to 001 abc.txt>
 Requirement 2:
 Requirement 2 Reference Example:
 
 Template function to be filled:
 
 function rename(options){
   const {name, nameWithoutExt, extension, modifyTime, size, index} = options
   // your code here.
   return name
 }
 
 Parameter description of the rename function: options, an object containing information about a single file
   name(string): File name
   nameWithoutExt(string): File name without the extension
   extension(string): File extension, including "."
   modifyTime(number): File modification time, in milliseconds timestamp
   size(number): File size, in bytes
   index(number): Index of the file displayed in the table
 Return value of the rename function: New file name (string type), returning an empty value will skip the renaming operation

 
*/
`

export default template
