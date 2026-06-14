FROM php:5.6-apache

RUN a2enmod rewrite

RUN docker-php-ext-install pdo pdo_mysql

RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

WORKDIR /var/www/html