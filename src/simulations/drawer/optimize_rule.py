import sys

initial_condition = "A"

def decode(rule_string):
  result = {}
  pairs = rule_string.split(";")
  for pair in pairs:
    values = pair.split(":")
    if len(values) != 2:
      raise Exception("invalid format {0}".format(pair))
    result[values[0]] = values[1].split(",")
  return result

def encode(rule):
  result = []
  for key, value in rule.items():
    result.append("{0}:{1}".format(key, ",".join(value)))
  return ";".join(result)

def optimize(rule, initial_condition):
  included_conditions = [initial_condition]
  optimized_rule = {}
  while len(included_conditions) > 0:
    additions = []
    for condition in included_conditions:
      next_conditions = rule[condition]
      optimized_rule[condition] = next_conditions
      for next_condition in next_conditions:
        try:
          int(next_condition)
        except:
          if (next_condition != ".") and (next_condition not in additions) and (next_condition not in optimized_rule.keys()):
            additions.append(next_condition)
    included_conditions = additions
  return optimized_rule

if __name__ == '__main__':
  optimized_rule = optimize(decode(sys.argv[1]), initial_condition)
  print(encode(optimized_rule))
