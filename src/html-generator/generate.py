import os, sys

DEBUG = True
root_path = '../../'
source_path = root_path + 'src/simulations/'
output_path = root_path + 'pages/'
index_page_name = 'index'
index_page_source_path = root_path + 'src/'
index_page_output_path = root_path
template_filepath = 'template.html'
arguments_filename = 'html_arguments.json'
excluded_paths = ['template']

def log(message):
  if DEBUG:
    print(message)

def log_error(message):
  print('\033[31m{}\033[0m'.format(message))

def page_names():
  from glob import glob
  path = source_path + '*/'
  return list(filter(lambda x: x not in excluded_paths, [path.split('/')[-2] for path in glob(path)]))

def read_arguments(filepath):
  log('read: {}'.format(filepath))
  import json
  with open(filepath, 'r') as file:
    return json.load(file)

def set_arguments(content, arguments):
  for key, value in arguments.items():
    marker = '{{%s}}' % key
    content = content.replace(marker, value)
  return content

def read_template():
  with open(template_filepath, encoding='utf-8') as file:
    return file.read()

def write_to(filepath, content):
  with open(filepath, 'w', encoding='utf-8') as file:
    file.write(content)

def generate_html(page_name, template, source_path, output_path, og_type):
  try:
    html_filepath = output_path + page_name + '.html'
    log('\ngenerate: {}'.format(html_filepath))
    arguments = read_arguments(source_path + page_name + '/' + arguments_filename)
    arguments["og_type"] = og_type
    content = set_arguments(template, arguments)
    write_to(html_filepath, content)
  except:
    log_error(sys.exc_info()[1])

if __name__ == '__main__':
  os.chdir(os.path.dirname(__file__))
  template = read_template()
  generate_html(index_page_name, template, index_page_source_path, index_page_output_path, "website")
  for page_name in page_names():
    generate_html(page_name, template, source_path, output_path, "article")
