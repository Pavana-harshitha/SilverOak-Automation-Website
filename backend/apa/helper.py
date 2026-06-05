def process_policy_table(covered_policy_information,key_field):
  value_list = []
  for policy in covered_policy_information:
    value = policy[key_field]

    if key_field == "policy_number":
      value_list.append(str(value))
    else:
      if value:
        value_list.append("Y")
      else:
        value_list.append("N")

  default_value = None if key_field == "policy_number" else "N" 
  joined_values = "|".join(value_list) if value_list else default_value
  return joined_values
print(process_policy_table({},"policy_number"))