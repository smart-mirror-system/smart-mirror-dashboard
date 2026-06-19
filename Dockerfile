FROM nginx:stable-alpine
COPY . /usr/share/nginx/html
EXPOSE 80

RUN chmod +x /usr/share/nginx/html/docker-entrypoint.sh && sed -i 's/\r$//' /usr/share/nginx/html/docker-entrypoint.sh

ENTRYPOINT ["/usr/share/nginx/html/docker-entrypoint.sh"]

# passing this cmd as a parameter to docker-entrypoint.sh then execute it after the script
# run nginx in foreground to keep container alive
CMD ["nginx", "-g", "daemon off;"]