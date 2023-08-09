# nodejs_http

## How to use
1. Install Node.js and RabbitMQ on your local machine, if not already installed.</br>
2. Clone the project repository to your computer.</br>
3. Navigate to the project folder.</br>
4. Установите необходимые зависимости с помощью npm.</br>
```npm install express body-parser amqplib```</br>
5. Create configuration files for microservices M1 and M2. You can use the example configuration files config.json in the project folder.</br>
6. Start microservice M1.</br>
[code]node M1.js[/code]</br>
7. Start microservice M2.</br>
```node M2.js```</br>

Your project should now be successfully deployed on your local machine and ready to handle asynchronous HTTP requests. To send a request just go to http://localhost:3000/ in your browser.
