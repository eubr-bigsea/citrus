/usr/sbin/nginx \
    -g "error_log /dev/stderr info;" \
    -c custom_nginx.conf -p $PWD
