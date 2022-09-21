CREATE TABLE IF NOT EXISTS public.starboard
(
    id character varying(20) COLLATE pg_catalog."default" NOT NULL,
    oid character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT starboard_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.starboard
    OWNER to "user";