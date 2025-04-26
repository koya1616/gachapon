--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    country character varying(255),
    postal_code character varying(255),
    address character varying(255),
    name character varying(255),
    user_id integer
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.addresses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authentication_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authentication_codes (
    id integer NOT NULL,
    code character varying(8) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    user_id integer
);


ALTER TABLE public.authentication_codes OWNER TO postgres;

--
-- Name: authentication_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.authentication_codes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.authentication_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lottery_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lottery_entries (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lottery_event_id integer NOT NULL,
    lottery_product_id integer NOT NULL,
    result integer DEFAULT 0 NOT NULL,
    created_at bigint DEFAULT floor((EXTRACT(epoch FROM now()) * (1000)::numeric)) NOT NULL
);


ALTER TABLE public.lottery_entries OWNER TO postgres;

--
-- Name: lottery_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lottery_entries ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lottery_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lottery_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lottery_events (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    start_at bigint NOT NULL,
    end_at bigint NOT NULL,
    result_at bigint NOT NULL,
    payment_deadline_at bigint NOT NULL,
    created_at text DEFAULT floor((EXTRACT(epoch FROM now()) * (1000)::numeric)) NOT NULL,
    status integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.lottery_events OWNER TO postgres;

--
-- Name: lottery_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lottery_events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lottery_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lottery_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lottery_products (
    id integer NOT NULL,
    lottery_event_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity_available integer DEFAULT 1 NOT NULL,
    created_at bigint DEFAULT floor((EXTRACT(epoch FROM now()) * (1000)::numeric)) NOT NULL
);


ALTER TABLE public.lottery_products OWNER TO postgres;

--
-- Name: lottery_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lottery_products ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lottery_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: payment_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_products (
    id integer NOT NULL,
    paypay_payment_id integer,
    quantity integer NOT NULL,
    price integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.payment_products OWNER TO postgres;

--
-- Name: payment_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.payment_products ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payment_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: paypay_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paypay_payments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    merchant_payment_id character varying(255) NOT NULL
);


ALTER TABLE public.paypay_payments OWNER TO postgres;

--
-- Name: paypay_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.paypay_payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.paypay_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    image character varying(255) NOT NULL,
    price integer NOT NULL,
    stock_quantity integer DEFAULT 0
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.products ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: shipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipments (
    id integer NOT NULL,
    paypay_payment_id integer,
    address character varying(255) NOT NULL,
    shipped_at bigint,
    delivered_at bigint,
    payment_failed_at bigint,
    created_at bigint DEFAULT floor((EXTRACT(epoch FROM now()) * (1000)::numeric)) NOT NULL,
    cancelled_at bigint
);


ALTER TABLE public.shipments OWNER TO postgres;

--
-- Name: shipments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.shipments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.shipments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: authentication_codes authentication_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_codes
    ADD CONSTRAINT authentication_codes_pkey PRIMARY KEY (id);


--
-- Name: lottery_entries lottery_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_entries
    ADD CONSTRAINT lottery_entries_pkey PRIMARY KEY (id);


--
-- Name: lottery_events lottery_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_events
    ADD CONSTRAINT lottery_events_pkey PRIMARY KEY (id);


--
-- Name: lottery_products lottery_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_products
    ADD CONSTRAINT lottery_products_pkey PRIMARY KEY (id);


--
-- Name: payment_products payment_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_products
    ADD CONSTRAINT payment_products_pkey PRIMARY KEY (id);


--
-- Name: paypay_payments paypay_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paypay_payments
    ADD CONSTRAINT paypay_payments_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: authentication_codes_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX authentication_codes_code_key ON public.authentication_codes USING btree (code);


--
-- Name: paypay_payments_merchant_payment_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX paypay_payments_merchant_payment_id_key ON public.paypay_payments USING btree (merchant_payment_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: lottery_products fk_lottery_event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_products
    ADD CONSTRAINT fk_lottery_event_id FOREIGN KEY (lottery_event_id) REFERENCES public.lottery_events(id);


--
-- Name: lottery_entries fk_lottery_event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_entries
    ADD CONSTRAINT fk_lottery_event_id FOREIGN KEY (lottery_event_id) REFERENCES public.lottery_events(id);


--
-- Name: lottery_entries fk_lottery_product_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_entries
    ADD CONSTRAINT fk_lottery_product_id FOREIGN KEY (lottery_product_id) REFERENCES public.lottery_products(id);


--
-- Name: shipments fk_paypay_payment_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT fk_paypay_payment_id FOREIGN KEY (paypay_payment_id) REFERENCES public.paypay_payments(id);


--
-- Name: payment_products fk_paypay_payment_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_products
    ADD CONSTRAINT fk_paypay_payment_id FOREIGN KEY (paypay_payment_id) REFERENCES public.paypay_payments(id);


--
-- Name: payment_products fk_product_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_products
    ADD CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: lottery_products fk_product_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_products
    ADD CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: authentication_codes fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authentication_codes
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: addresses fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: paypay_payments fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paypay_payments
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: lottery_entries fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lottery_entries
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

