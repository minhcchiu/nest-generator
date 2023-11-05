create table car (
	id UUID NOT NULL PRIMARY KEY,
	make VARCHAR(50) NOT NULL,
	model VARCHAR(50) NOT NULL,
	price NUMERIC(19, 2) NOT NULL
);

create table person (
	id UUID NOT NULL PRIMARY KEY,
	fullName VARCHAR(50),
	email VARCHAR(50),
	date_of_birth DATE,
	country VARCHAR(50),
	gender VARCHAR(50),
	car_id UUID REFERENCES car(id),
	UNIQUE (car_id),
	UNIQUE (email) 
);

insert into car (id, make, model, price) values (uuid_generate_v4(), 'GMC', 'Yukon Denali', 43631.76);
insert into car (id, make, model, price) values (uuid_generate_v4(), 'Geo', 'Prizm', 72348.98);
insert into car (id, make, model, price) values (uuid_generate_v4(), 'Suzuki', 'Swift', 30796.19);
insert into car (id, make, model, price) values (uuid_generate_v4(), 'Mitsubishi', 'Lancer Evolution', 22990.20);

insert into person (id, fullName, email, date_of_birth, country, gender) values (uuid_generate_v4(), 'Bill Lake', 'blake0@friendfeed.com', '2023-10-09', 'Poland', 'Male');
insert into person (id, fullName, email, date_of_birth, country, gender) values (uuid_generate_v4(), 'Abram Cochrane', 'acochrane1@gnu.org', '2022-11-08', 'France', 'Male');
insert into person (id, fullName, email, date_of_birth, country, gender) values (uuid_generate_v4(), 'Ricky Teissier', null, '2023-05-02', 'Peru', 'Polygender');
insert into person (id, fullName, email, date_of_birth, country, gender) values (uuid_generate_v4(), 'Maje Bloxsome', 'mbloxsome3@surveymonkey.com', '2023-01-12', 'Sweden', 'Male');
insert into person (id, fullName, email, date_of_birth, country, gender) values (uuid_generate_v4(), 'Gan Muspratt', 'gmuspratt4@timesonline.co.uk', '2023-08-05', 'France', 'Male');
insert into person (id, fullName, email, date_of_birth, country, gender) values (uuid_generate_v4(), 'Noelani Moen', 'nmoen5@qq.com', '2023-05-28', 'China', 'Female');


create table car (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	make VARCHAR(50) NOT NULL,
	model VARCHAR(50) NOT NULL,
	price NUMERIC(19, 2) NOT NULL
);

create table person (
	id BIGSERIAL NOT NULL PRIMARY KEY,
	fullName VARCHAR(50),
	email VARCHAR(50),
	date_of_birth DATE,
	country VARCHAR(50),
	gender VARCHAR(50),
	car_id BIGINT UNIQUE,
	FOREIGN KEY (car_id) REFERENCES car(id)
);

insert into car (id, make, model, price) values (1, 'GMC', 'Yukon Denali', 43631.76);
insert into car (id, make, model, price) values (2, 'Geo', 'Prizm', 72348.98);
insert into car (id, make, model, price) values (3, 'Suzuki', 'Swift', 30796.19);
insert into car (id, make, model, price) values (4, 'Mitsubishi', 'Lancer Evolution', 22990.20);

insert into person (id, fullName, email, date_of_birth, country, gender, car_id) values (1, 'Bill Lake', 'blake0@friendfeed.com', '2023-10-09', 'Poland', 'Male', 1);
insert into person (id, fullName, email, date_of_birth, country, gender, car_id) values (2, 'Abram Cochrane', 'acochrane1@gnu.org', '2022-11-08', 'France', 'Male', 2);
insert into person (id, fullName, email, date_of_birth, country, gender, car_id) values (3, 'Ricky Teissier', null, '2023-05-02', 'Peru', 'Polygender', 3);
insert into person (id, fullName, email, date_of_birth, country, gender, car_id) values (4, 'Maje Bloxsome', 'mbloxsome3@surveymonkey.com', '2023-01-12', 'Sweden', 'Male', 4);
insert into person (id, fullName, email, date_of_birth, country, gender, car_id) values (5, 'Gan Muspratt', 'gmuspratt4@timesonline.co.uk', '2023-08-05', 'France', 'Male', null);
insert into person (id, fullName, email, date_of_birth, country, gender, car_id) values (6, 'Noelani Moen', 'nmoen5@qq.com', '2023-05-28', 'China', 'Female', null);
