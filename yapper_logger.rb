require 'sinatra'
require 'json'

set :port, 3000
before do
  response.headers['Access-Control-Allow-Origin'] = '*'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
end

options '*' do
 200
end

post '/log' do
  content_type :json
  request_data = JSON.parse(request.body.read)

  type =  request_data['type']
  message = request_data['message']
  source = request_data['source']

  log_message = "[#{type.upcase}] #{source}: #{message}"

  case type
  when 'log'
    puts log_message
  when 'warn'
    warn log_message
  when 'error'
    $stderr.puts log_message
  else
    puts log_message
  end

  {status: 'ok'}.to_json
end