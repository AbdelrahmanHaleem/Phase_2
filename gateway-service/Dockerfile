FROM nginx:1.25

# Remove the default NGINX configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
