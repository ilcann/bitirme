FROM node:20-alpine AS frontend_builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM php:5.6-apache

RUN a2enmod rewrite

RUN docker-php-ext-install pdo pdo_mysql

RUN echo '<Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

WORKDIR /var/www/html

RUN mkdir -p /var/www/html/ilcan21

COPY --from=frontend_builder /app/frontend/dist/ /var/www/html/ilcan21/

RUN printf '%s\n' \
    'RewriteEngine On' \
    'RewriteBase /ilcan21/' \
    'RewriteCond %{REQUEST_URI} ^/ilcan21/api/ [NC]' \
    'RewriteRule ^ - [L]' \
    'RewriteCond %{REQUEST_FILENAME} -f [OR]' \
    'RewriteCond %{REQUEST_FILENAME} -d' \
    'RewriteRule ^ - [L]' \
    'RewriteRule . /ilcan21/index.html [L]' \
    > /var/www/html/ilcan21/.htaccess