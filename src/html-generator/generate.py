import os

def read_arguments(filepath):
  import json
  with open(filepath, 'r') as file:
    return json.load(file)

def set_arguments(content, arguments):
  for key, value in arguments.items():
    marker = '{{%s}}' % key
    content = content.replace(marker, value)
  return content

def read_template():
  with open('template.html', encoding='utf-8') as file:
    return file.read()

def write_to(filepath, content):
  with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)

if __name__ == '__main__':
  os.chdir(os.path.dirname(__file__))
  template = read_template()
  arguments = read_arguments('template.json')
  content = set_arguments(template, arguments)
  write_to('hoge.html', content)
