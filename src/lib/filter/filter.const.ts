export const filterTypeOptions: { label: string; value: FileFilterType }[] = [
  {
    label: "Include Files",
    value: "include"
  },
  {
    label: "Exclude Files",
    value: "exclude"
  }
]

export const matchOptions: { label: string; value: FileFilterProp }[] = [
  {
    label: "File Name",
    value: "filename"
  },
  {
    label: "File Extension",
    value: "extension"
  },
  {
    label: "File Size",
    value: "size"
  },
  {
    label: "Modify Time",
    value: "modifyTime"
  }
]

export const stringPredicateOptions: PredicateItem[] = [
  {
    label: "Contains",
    value: "contains"
  },
  {
    label: "Does Not Contain",
    value: "notContains"
  },
  {
    label: "Starts With",
    value: "startsWith"
  },
  {
    label: "Ends With",
    value: "endsWith"
  },
  {
    label: "Equals",
    value: "equals"
  }
]

export const numberPredicateOptions: PredicateItem[] = [
  {
    label: "Greater Than",
    value: "gt"
  },
  {
    label: "Greater Than or Equal To",
    value: "ge"
  },
  {
    label: "Less Than",
    value: "lt"
  },
  {
    label: "Less Than or Equal To",
    value: "le"
  },
  {
    label: "Equals",
    value: "eq"
  }
]
