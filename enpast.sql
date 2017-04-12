--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.6
-- Dumped by pg_dump version 9.5.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: users; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA users;


ALTER SCHEMA users OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = public, pg_catalog;

--
-- Name: delete_old_sessions(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION delete_old_sessions() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM users.sessions WHERE time_updated < NOW() - INTERVAL '2 hours';
  RETURN;
END;
$$;


ALTER FUNCTION public.delete_old_sessions() OWNER TO postgres;

--
-- Name: update_changetimestamp_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION update_changetimestamp_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.time_updated = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_changetimestamp_column() OWNER TO postgres;

SET search_path = users, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: containers; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE containers (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    uid uuid NOT NULL,
    cname character varying(128),
    encryption_type character varying(20),
    encrypted_random character varying(256),
    icon_url text,
    time_created timestamp without time zone DEFAULT now(),
    time_expires timestamp without time zone,
    key_stack text,
    time_updated timestamp without time zone,
    description character varying(256)
);


ALTER TABLE containers OWNER TO postgres;

--
-- Name: data; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE data (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    firstname character varying(40) NOT NULL,
    lastname character varying(40) NOT NULL,
    username character varying(128) NOT NULL,
    password character varying(128) NOT NULL,
    usersalt character varying(128) NOT NULL,
    verification_random character varying(128),
    is_active integer NOT NULL,
    is_verified integer NOT NULL,
    activation_time timestamp without time zone,
    verification_time timestamp without time zone,
    creation_time timestamp without time zone DEFAULT now(),
    twofactor_stat integer NOT NULL,
    twofactor_secret character varying(128),
    notes text,
    key_stack text
);


ALTER TABLE data OWNER TO postgres;

--
-- Name: entries; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE entries (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    uid uuid NOT NULL,
    name character varying(128),
    icon_url text,
    time_created timestamp without time zone DEFAULT now(),
    time_expires timestamp without time zone,
    data text,
    pfid uuid,
    pcid uuid,
    time_updated timestamp without time zone
);


ALTER TABLE entries OWNER TO postgres;

--
-- Name: folders; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE folders (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    uid uuid NOT NULL,
    fname character varying(128),
    icon_url text,
    time_created timestamp without time zone DEFAULT now(),
    time_expires timestamp without time zone,
    pcid uuid,
    pfid uuid,
    time_updated timestamp without time zone,
    description text
);


ALTER TABLE folders OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE sessions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    sessid character varying(128) NOT NULL,
    data text NOT NULL,
    time_created timestamp without time zone DEFAULT now(),
    time_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE sessions OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE settings (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    uid uuid NOT NULL,
    data text,
    time_created timestamp without time zone DEFAULT now(),
    time_updated timestamp without time zone,
    platform integer
);


ALTER TABLE settings OWNER TO postgres;

--
-- Name: templates; Type: TABLE; Schema: users; Owner: postgres
--

CREATE TABLE templates (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    uid uuid NOT NULL,
    data text NOT NULL,
    time_created timestamp without time zone DEFAULT now(),
    time_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE templates OWNER TO postgres;

--
-- Data for Name: containers; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY containers (id, uid, cname, encryption_type, encrypted_random, icon_url, time_created, time_expires, key_stack, time_updated, description) FROM stdin;
e299668d-5105-4c74-a489-d32090136d86	e9c32980-9c31-474d-8fb4-2c01d702a483	MainContainer2	B1			2016-11-06 20:17:32.307657	\N	\N	\N	\N
8f3f749f-b38d-45c2-bc64-a609b75e729f	e9c32980-9c31-474d-8fb4-2c01d702a483	MainContainer3	B3			2016-11-06 20:18:48.655784	\N	\N	\N	\N
5a9fa0fe-1335-4b0e-81d7-6d66acda8e85	e9c32980-9c31-474d-8fb4-2c01d702a483	MainContainer4	B3			2016-11-07 11:29:48.08085	\N	\N	\N	\N
2b1171e6-41bc-49a6-87fa-af4b44eca0f3	e9c32980-9c31-474d-8fb4-2c01d702a483	TestMain1	A1			2016-11-06 20:14:35.731961	\N	\N	\N	\N
\.


--
-- Data for Name: data; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY data (id, firstname, lastname, username, password, usersalt, verification_random, is_active, is_verified, activation_time, verification_time, creation_time, twofactor_stat, twofactor_secret, notes, key_stack) FROM stdin;
e9c32980-9c31-474d-8fb4-2c01d702a483	Test	Tester	admin@admin.com	ac04d6489b8f8c88271611622d114a4557007967bcca863ad766b4b50fef9475f6e85cf386cb232463cb0d144829530280b1da011ccd90dc729c85c187ea9e6c	28e254ba837bd724ab23245378b9f68f	185e8c3278ca5098302863f539e420f33426f3cce4699e0a7b02dbe07c4404e7	1	1	\N	\N	2016-11-06 19:57:42.562831	0	\N	\N	\N
\.


--
-- Data for Name: entries; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY entries (id, uid, name, icon_url, time_created, time_expires, data, pfid, pcid, time_updated) FROM stdin;
\.


--
-- Data for Name: folders; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY folders (id, uid, fname, icon_url, time_created, time_expires, pcid, pfid, time_updated, description) FROM stdin;
8b7790e9-17ab-49dd-bfb5-6f67ba9b87e2	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder1		2016-11-06 20:32:49.224608	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	\N	\N	\N
49d4ae36-f812-4c3e-81b1-dd7f5f1f07fe	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2		2016-11-06 20:33:15.102269	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	\N	\N	\N
3e6b4311-4c0a-4630-bd3e-680b057a38d3	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub1		2016-11-06 20:34:13.991456	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	49d4ae36-f812-4c3e-81b1-dd7f5f1f07fe	\N	\N
77807f0b-801c-4ff5-8e41-50fd0dd4021f	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2		2016-11-06 20:34:25.666141	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	49d4ae36-f812-4c3e-81b1-dd7f5f1f07fe	\N	\N
aabe182a-a156-4973-8905-5d824e1a8077	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2Sub1		2016-11-06 22:45:39.792224	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	77807f0b-801c-4ff5-8e41-50fd0dd4021f	\N	\N
6b2c283b-cc45-4d0f-830f-13108d1f3d80	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2Sub2		2016-11-06 22:45:49.89928	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	77807f0b-801c-4ff5-8e41-50fd0dd4021f	\N	\N
195019e6-748e-4215-8dbb-82ebc9398c6f	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2Sub3		2016-11-06 22:45:55.185501	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	77807f0b-801c-4ff5-8e41-50fd0dd4021f	\N	\N
074c7d77-0c55-4999-90d4-6b3b432f7ba8	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2Sub5		2016-11-07 11:36:46.73029	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	77807f0b-801c-4ff5-8e41-50fd0dd4021f	\N	\N
3345a787-de64-4c96-8c2c-5ffc87c5e64e	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2Sub6		2016-11-07 11:37:01.782832	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	77807f0b-801c-4ff5-8e41-50fd0dd4021f	\N	\N
2b807e54-8640-41db-bd1a-fd271d654990	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2Sub66		2016-11-07 11:37:11.206759	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	77807f0b-801c-4ff5-8e41-50fd0dd4021f	\N	\N
ca616401-9300-47e0-83ee-24ee8e3829a9	e9c32980-9c31-474d-8fb4-2c01d702a483	MainFolder2Sub2Sub7		2016-11-07 11:37:46.283877	\N	2b1171e6-41bc-49a6-87fa-af4b44eca0f3	77807f0b-801c-4ff5-8e41-50fd0dd4021f	\N	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY sessions (id, sessid, data, time_created, time_updated) FROM stdin;
dc961b57-c802-4653-9ce0-8e7e547e55e2	a04ce66ede4fe15f2bb073a1e5925e84366d2541ce70ce8310106087494a5b2a3eb6381df356550f64f2c47007ba2d5082ba14791ce35bc24bd808fe2c7569a7	{"firstname":"TestFirstname","lastname":"TestLastname","email":"test@test.com","uid":"cb8d5a9d-8833-4252-9e11-a49d15b15e7f"}	2016-10-24 13:36:39.456797	2016-10-24 13:36:39.456797
b3fbc6ad-d067-4ccc-bc6f-2ebe7b365678	f484f12b2767726d447148811732ab518eaaf28afc8a0bc8f7b07fa105840b9d5f53bbb747df46a7f55532770e2e775d279a892a73c19e5732645443a95eac2d	{"firstname":"Test","lastname":"Tester","email":"test@test.com","uid":"3b98e732-4e68-4c1f-8761-3d69431f2ab1"}	2016-10-24 14:01:27.500968	2016-10-24 14:01:27.500968
439e9bdf-a9c3-41b4-af5e-07512ad1c5d3	e73ad70cb03e585c5fd3d899eff113ce2dfefd344868084cde76fc4b9bb0f148da15cd8c8f2d1342323edb61c7739fbbd29089e150e7eac7798477d1244e9f97	{"firstname":"Test","lastname":"Tester","email":"admin@admin.com","uid":"93208839-8cb0-4153-b1a2-cff0be48aa2a"}	2016-10-24 15:37:27.959136	2016-10-24 16:58:27.315857
93b60e69-9e32-4c1c-9a33-d89620bf17a0	262d1567510dde4e7ff705362a55fd2e31d4cf8a3bea0f41c754efb0215cb5c4df69688723619ac55de1e8da31af7fe35a6022b511ef6ef36484f94945c26201	{"firstname":"Test","lastname":"Tester","email":"admin@admin.com","uid":"e9c32980-9c31-474d-8fb4-2c01d702a483"}	2016-11-06 22:02:30.195682	2016-11-06 22:46:20.580721
8e09c1c0-d715-45eb-8efc-098f390d10e3	aeade933b409c124b8871133374c993a29f8bb3e6e63c8617af840b2ea802097606ff6afb06b8d11436cf3f1fdca1a98c7945244294abfbe58228154a22d791f	{"firstname":"Test","lastname":"Tester","email":"admin@admin.com","uid":"e9c32980-9c31-474d-8fb4-2c01d702a483"}	2016-11-06 20:00:20.85362	2016-11-06 22:00:12.922577
5058bc59-f847-431b-af23-80ff4aa790cf	c4ab5042e14cbe87118bb6ec5c7d4385e08d31a3b982d0ce3d76bb867a4f68096cf4fcf537288e3ee530fc3a5e5b2c6016c6d293556d9b67170fb1eadaf708d4	{"firstname":"Test","lastname":"Tester","email":"admin@admin.com","uid":"e9c32980-9c31-474d-8fb4-2c01d702a483"}	2016-11-07 11:21:01.122587	2016-11-07 11:45:07.46394
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY settings (id, uid, data, time_created, time_updated, platform) FROM stdin;
\.


--
-- Data for Name: templates; Type: TABLE DATA; Schema: users; Owner: postgres
--

COPY templates (id, uid, data, time_created, time_updated) FROM stdin;
\.


--
-- Name: data_pkey; Type: CONSTRAINT; Schema: users; Owner: postgres
--

ALTER TABLE ONLY data
    ADD CONSTRAINT data_pkey PRIMARY KEY (username);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: users; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA users FROM PUBLIC;
REVOKE ALL ON SCHEMA users FROM postgres;
GRANT ALL ON SCHEMA users TO postgres;
GRANT ALL ON SCHEMA users TO webapp;


--
-- Name: containers; Type: ACL; Schema: users; Owner: postgres
--

REVOKE ALL ON TABLE containers FROM PUBLIC;
REVOKE ALL ON TABLE containers FROM postgres;
GRANT ALL ON TABLE containers TO postgres;
GRANT ALL ON TABLE containers TO webapp;


--
-- Name: data; Type: ACL; Schema: users; Owner: postgres
--

REVOKE ALL ON TABLE data FROM PUBLIC;
REVOKE ALL ON TABLE data FROM postgres;
GRANT ALL ON TABLE data TO postgres;
GRANT ALL ON TABLE data TO webapp;


--
-- Name: folders; Type: ACL; Schema: users; Owner: postgres
--

REVOKE ALL ON TABLE folders FROM PUBLIC;
REVOKE ALL ON TABLE folders FROM postgres;
GRANT ALL ON TABLE folders TO postgres;
GRANT ALL ON TABLE folders TO webapp;


--
-- Name: sessions; Type: ACL; Schema: users; Owner: postgres
--

REVOKE ALL ON TABLE sessions FROM PUBLIC;
REVOKE ALL ON TABLE sessions FROM postgres;
GRANT ALL ON TABLE sessions TO postgres;
GRANT ALL ON TABLE sessions TO webapp;


--
-- Name: settings; Type: ACL; Schema: users; Owner: postgres
--

REVOKE ALL ON TABLE settings FROM PUBLIC;
REVOKE ALL ON TABLE settings FROM postgres;
GRANT ALL ON TABLE settings TO postgres;
GRANT ALL ON TABLE settings TO webapp;


--
-- PostgreSQL database dump complete
--

