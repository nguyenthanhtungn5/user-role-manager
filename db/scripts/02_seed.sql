INSERT INTO roles (name) VALUES ('admin'), ('user'), ('support');

INSERT INTO permissions (name) VALUES
  ('user_read'), ('user_create'), ('user_delete'), ('role_read'), ('role_create'), ('role_delete');

INSERT INTO users (first_name, last_name, email, phone) VALUES
  ('Tung'), ('Nguyen'), ('tung@gmail.com'), ('01234556789');