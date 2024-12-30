FROM postgres:16-alpine

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Set default environment variables
ENV POSTGRES_DB=translation_platform
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin_password

# Expose PostgreSQL port
EXPOSE 5432

# Add custom PostgreSQL configuration
COPY postgresql.conf /etc/postgresql/postgresql.conf

# Run PostgreSQL with custom configuration
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
