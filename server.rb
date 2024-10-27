#!/usr/bin/env ruby

require 'sinatra'
require 'json'

set :port, 3000
before do
  response.headers['Access-Control-Allow-Origin'] = '*'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
end

# ANSI color codes
LOG_COLORS = {
  'log' => "\e[42m", #32m    
  'warn' => "\e[43m",#33m
  'error' => "\e[41m",#31m    
  'info' => "\e[44m",#34m     
  'table' => "\e[46m",#36m    
  'clear' => "\e[45m"#35m     
}
RESET_COLOR = "\e[0m"     

options '*' do
  200
end

post '/log' do
  content_type :json

  if request.body.size > 0
    request_data = JSON.parse(request.body.read)

    type =  request_data['type']
    message = request_data['message']
    source = request_data['source']

    #TODO: add some custom logic to display table data in more structured manner?
    #{message.kind_of?(Array)

    log_message = "[#{type.upcase}] #{source}: #{message}}"

    # apply color based on log type
    colored_message = "#{LOG_COLORS[type] || RESET_COLOR}#{log_message}#{RESET_COLOR}"
  
    case type
    when 'log'
      puts colored_message
    when 'warn'
      warn colored_message
    when 'error'
      $stderr.puts colored_message
    when 'table'
      puts colored_message
    else
      puts colored_message
    end
  end

  { status: 'ok' }.to_json
end

post '/clear' do
  content_type :json
  if Gem.win_platform?
    system('cls')
  else
    system('clear')
  end

  clear_message = "#{LOG_COLORS['clear']}[CLEAR] Console cleared after yapper restart!#{RESET_COLOR}"
  puts clear_message
  { status: 'console cleared' }.to_json
end