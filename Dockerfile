FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh && sed -i 's/\r$//' /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# passing this cmd as a parameter to docker-entrypoint.sh then execute it after the script
# run nginx in foreground to keep container alive
CMD ["nginx", "-g", "daemon off;"]