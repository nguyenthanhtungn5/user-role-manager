INSERT INTO roles(name) VALUES ('admin'), ('user'), ('support');

INSERT INTO permissions(name) VALUES
  ('user_read'), ('user_create'), ('user_delete'), ('role_read'), ('role_create'), ('role_delete');

INSERT INTO users(first_name, last_name, email, phone) VALUES
  ('Tung', 'Nguyen', 'default@gmail.com', '01234556789');

INSERT INTO role_permissions(role_id, permission_id) VALUES
  (1, 1);

INSERT INTO user_roles(user_id, role_id) VALUES
  (1, 1);