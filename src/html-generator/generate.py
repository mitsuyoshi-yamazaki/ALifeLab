import os, sys
from glob import glob

DEBUG = True
root_path = '../../'
simulation_page_source_path = root_path + 'src/simulations/'
list_page_source_path = root_path + 'src/pages/'
output_path = root_path + 'pages/'
template_filepath = 'template.html'
arguments_filename = 'html_arguments.json'
excluded_paths = ['template']
og_url_root = 'https://mitsuyoshi-yamazaki.github.io/ALifeLab'

def log(message):
  if DEBUG:
    print(message)

def log_error(message):
  print('\033[31m{}\033[0m'.format(message))

def list_page_paths(path):
  paths = [p for p in glob(path + '*') if os.path.isdir(p)]
  from itertools import chain
  return paths + list(chain.from_iterable([list_page_paths(p + '/') for p in paths]))

def simulation_page_names():
  path = simulation_page_source_path + '*/'
  return list(filter(lambda x: x not in excluded_paths, [path.split('/')[-2] for path in glob(path)]))

def read_arguments(filepath):
  #log('read: {}'.format(filepath))
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

def generate_script_tags(arguments):
  if "additional_script_paths" in arguments:
    additional_script_paths = arguments["additional_script_paths"]
    del arguments["additional_script_paths"]
    if (additional_script_paths is not None) and (len(additional_script_paths)) > 0:
      return "\n".join(['<script src="{0}"></script>'.format(path) for path in additional_script_paths])
  return ""

def generate_html(page_name, template, source_path, output_path, og_type, og_url):
  try:
    html_filepath = output_path + page_name + '.html'
    log('generate: {}'.format(html_filepath))
    arguments = read_arguments(source_path + arguments_filename)
    arguments["og_type"] = og_type
    arguments["og_url"] = og_url
    arguments["additional_scripts"] = generate_script_tags(arguments)
    og_image = arguments["og_image"]
    if len(og_image) > 0:
      arguments["og_image"] = og_url_root + og_image
    content = set_arguments(template, arguments)
    write_to(html_filepath, content)
  except:
    log_error(sys.exc_info()[1])

def generate_index_page_html(template):
  og_url = og_url_root + '/'
  generate_html('index', template, root_path + 'src/pages/', root_path, 'website', og_url)

def generate_list_page_htmls(template):
  paths = list_page_paths(list_page_source_path)
  print(paths) # TODO:
  for path in paths:
    page_name = path.split('/')[-1]
    og_url = og_url_root + '/pages/' + page_name + '.html'
    generate_html(page_name, template, path + '/', output_path, 'website', og_url)

def generate_simulation_page_html(template, page_name):
  source_path = simulation_page_source_path + page_name + '/'
  og_url = og_url_root + '/pages/' + page_name + '.html'
  generate_html(page_name, template, source_path, output_path, 'article', og_url)

if __name__ == '__main__':
  os.chdir(os.path.dirname(__file__))
  template = read_template()
  generate_index_page_html(template)
  generate_list_page_htmls(template)
  for page_name in simulation_page_names():
    generate_simulation_page_html(template, page_name)
