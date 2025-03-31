--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-03-31 19:16:45

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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 16572)
-- Name: Complaints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Complaints" (
    "ComplaintId" integer NOT NULL,
    "ComplaintType" text NOT NULL,
    "ComplaintDescription" text NOT NULL,
    "CurrentStatus" text NOT NULL,
    "ComplaintDepartmentId" integer NOT NULL,
    "AssignedTo" integer,
    "IsResolved" boolean DEFAULT false NOT NULL,
    "Resolution" text,
    "NeedsApproval" boolean DEFAULT false NOT NULL,
    "CreatedOn" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "CreatedBy" integer DEFAULT '-1'::integer NOT NULL,
    "ModifiedOn" timestamp with time zone,
    "ModifiedBy" integer
);


ALTER TABLE public."Complaints" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16608)
-- Name: Complaints_ComplaintId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Complaints_ComplaintId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Complaints_ComplaintId_seq" OWNER TO postgres;

--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 228
-- Name: Complaints_ComplaintId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Complaints_ComplaintId_seq" OWNED BY public."Complaints"."ComplaintId";


--
-- TOC entry 223 (class 1259 OID 16511)
-- Name: Departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Departments" (
    "DepartmentId" integer NOT NULL,
    "DepartmentName" text NOT NULL,
    "Description" text NOT NULL,
    "IsDeleted" boolean DEFAULT false NOT NULL,
    "CreatedOn" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "CreatedBy" integer DEFAULT '-1'::integer NOT NULL,
    "ModifiedOn" timestamp with time zone,
    "ModifiedBy" integer
);


ALTER TABLE public."Departments" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16521)
-- Name: Departments_DepartmentId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Departments_DepartmentId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Departments_DepartmentId_seq" OWNER TO postgres;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 224
-- Name: Departments_DepartmentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Departments_DepartmentId_seq" OWNED BY public."Departments"."DepartmentId";


--
-- TOC entry 225 (class 1259 OID 16523)
-- Name: EmployeeRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmployeeRoles" (
    "EmployeeRoleId" integer NOT NULL,
    "RoleName" text NOT NULL,
    "RoleDescription" text NOT NULL,
    "DepartmentId" integer NOT NULL,
    "IsDeleted" boolean DEFAULT false NOT NULL,
    "CreatedOn" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "CreatedBy" integer NOT NULL,
    "ModifiedOn" timestamp with time zone,
    "ModifiedBy" integer
);


ALTER TABLE public."EmployeeRoles" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16547)
-- Name: EmployeeRoles_EmployeeRoleId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EmployeeRoles_EmployeeRoleId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EmployeeRoles_EmployeeRoleId_seq" OWNER TO postgres;

--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 226
-- Name: EmployeeRoles_EmployeeRoleId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EmployeeRoles_EmployeeRoleId_seq" OWNED BY public."EmployeeRoles"."EmployeeRoleId";


--
-- TOC entry 221 (class 1259 OID 16445)
-- Name: SystemUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemUsers" (
    "SystemUserId" integer NOT NULL,
    "UserId" integer NOT NULL,
    "UserRoleId" integer NOT NULL,
    "Username" text NOT NULL,
    "Password" text NOT NULL,
    "IsApproved" boolean DEFAULT false NOT NULL,
    "IsSuspended" boolean DEFAULT false NOT NULL,
    "IsDeleted" boolean DEFAULT false NOT NULL,
    "ResetCode" text,
    "CreatedOn" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "CreatedBy" integer DEFAULT '-1'::integer NOT NULL,
    "ModifiedOn" timestamp with time zone,
    "ModifiedBy" integer,
    "EmployeeRoleId" integer
);


ALTER TABLE public."SystemUsers" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16465)
-- Name: SystemUsers_SystemUserId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SystemUsers_SystemUserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SystemUsers_SystemUserId_seq" OWNER TO postgres;

--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 222
-- Name: SystemUsers_SystemUserId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SystemUsers_SystemUserId_seq" OWNED BY public."SystemUsers"."SystemUserId";


--
-- TOC entry 217 (class 1259 OID 16410)
-- Name: UserRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRoles" (
    "UserRoleId" integer NOT NULL,
    "UserRoleName" text NOT NULL,
    "IsDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."UserRoles" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16427)
-- Name: UserRoles_UserRoleId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserRoles_UserRoleId_seq"
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserRoles_UserRoleId_seq" OWNER TO postgres;

--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 218
-- Name: UserRoles_UserRoleId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserRoles_UserRoleId_seq" OWNED BY public."UserRoles"."UserRoleId";


--
-- TOC entry 219 (class 1259 OID 16432)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "UserId" integer NOT NULL,
    "FirstName" text NOT NULL,
    "LastName" text NOT NULL,
    "IdentificationNumber" text NOT NULL,
    "ContactNumber" text NOT NULL,
    "Email" text,
    "IsApartment" boolean DEFAULT false NOT NULL,
    "Apartment" text,
    "Building" text,
    "Street" text,
    "Region" text,
    "City" text,
    "Country" text,
    "IsForeigner" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16442)
-- Name: Users_UserId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_UserId_seq" OWNER TO postgres;

--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 220
-- Name: Users_UserId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_UserId_seq" OWNED BY public."Users"."UserId";


--
-- TOC entry 4684 (class 2604 OID 16609)
-- Name: Complaints ComplaintId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints" ALTER COLUMN "ComplaintId" SET DEFAULT nextval('public."Complaints_ComplaintId_seq"'::regclass);


--
-- TOC entry 4677 (class 2604 OID 16522)
-- Name: Departments DepartmentId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Departments" ALTER COLUMN "DepartmentId" SET DEFAULT nextval('public."Departments_DepartmentId_seq"'::regclass);


--
-- TOC entry 4681 (class 2604 OID 16548)
-- Name: EmployeeRoles EmployeeRoleId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeRoles" ALTER COLUMN "EmployeeRoleId" SET DEFAULT nextval('public."EmployeeRoles_EmployeeRoleId_seq"'::regclass);


--
-- TOC entry 4671 (class 2604 OID 16466)
-- Name: SystemUsers SystemUserId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemUsers" ALTER COLUMN "SystemUserId" SET DEFAULT nextval('public."SystemUsers_SystemUserId_seq"'::regclass);


--
-- TOC entry 4666 (class 2604 OID 16428)
-- Name: UserRoles UserRoleId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoles" ALTER COLUMN "UserRoleId" SET DEFAULT nextval('public."UserRoles_UserRoleId_seq"'::regclass);


--
-- TOC entry 4668 (class 2604 OID 16443)
-- Name: Users UserId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN "UserId" SET DEFAULT nextval('public."Users_UserId_seq"'::regclass);


--
-- TOC entry 4706 (class 2606 OID 16582)
-- Name: Complaints Complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_pkey" PRIMARY KEY ("ComplaintId");


--
-- TOC entry 4702 (class 2606 OID 16520)
-- Name: Departments Departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Departments"
    ADD CONSTRAINT "Departments_pkey" PRIMARY KEY ("DepartmentId");


--
-- TOC entry 4704 (class 2606 OID 16531)
-- Name: EmployeeRoles EmployeeRoles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeRoles"
    ADD CONSTRAINT "EmployeeRoles_pkey" PRIMARY KEY ("EmployeeRoleId");


--
-- TOC entry 4700 (class 2606 OID 16454)
-- Name: SystemUsers SystemUsers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemUsers"
    ADD CONSTRAINT "SystemUsers_pkey" PRIMARY KEY ("SystemUserId");


--
-- TOC entry 4690 (class 2606 OID 16417)
-- Name: UserRoles UserRoles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRoles"
    ADD CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("UserRoleId");


--
-- TOC entry 4692 (class 2606 OID 16560)
-- Name: Users Users_ContactNumber_Unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_ContactNumber_Unique" UNIQUE ("ContactNumber");


--
-- TOC entry 4694 (class 2606 OID 16558)
-- Name: Users Users_Email_Unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_Email_Unique" UNIQUE ("Email");


--
-- TOC entry 4696 (class 2606 OID 16556)
-- Name: Users Users_IdentificationNumber_Unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_IdentificationNumber_Unique" UNIQUE ("IdentificationNumber");


--
-- TOC entry 4698 (class 2606 OID 16441)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("UserId");


--
-- TOC entry 4713 (class 2606 OID 16588)
-- Name: Complaints Complaints_Departments_DepartmentComplaintId_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_Departments_DepartmentComplaintId_fk" FOREIGN KEY ("ComplaintDepartmentId") REFERENCES public."Departments"("DepartmentId");


--
-- TOC entry 4714 (class 2606 OID 16610)
-- Name: Complaints Complaints_SystemUsers_AssignedTo_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_SystemUsers_AssignedTo_fk" FOREIGN KEY ("AssignedTo") REFERENCES public."Users"("UserId") NOT VALID;


--
-- TOC entry 4715 (class 2606 OID 16615)
-- Name: Complaints Complaints_SystemUsers_CreatedBy_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_SystemUsers_CreatedBy_fk" FOREIGN KEY ("CreatedBy") REFERENCES public."Users"("UserId") NOT VALID;


--
-- TOC entry 4716 (class 2606 OID 16620)
-- Name: Complaints Complaints_SystemUsers_ModifiedBy_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_SystemUsers_ModifiedBy_fk" FOREIGN KEY ("ModifiedBy") REFERENCES public."Users"("UserId") NOT VALID;


--
-- TOC entry 4710 (class 2606 OID 16532)
-- Name: EmployeeRoles EmployeeRoles_Departments_DepartmentId_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeRoles"
    ADD CONSTRAINT "EmployeeRoles_Departments_DepartmentId_fk" FOREIGN KEY ("DepartmentId") REFERENCES public."Departments"("DepartmentId");


--
-- TOC entry 4711 (class 2606 OID 16625)
-- Name: EmployeeRoles EmployeeRoles_SystemUsers_CreatedBy_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeRoles"
    ADD CONSTRAINT "EmployeeRoles_SystemUsers_CreatedBy_fk" FOREIGN KEY ("CreatedBy") REFERENCES public."Users"("UserId") NOT VALID;


--
-- TOC entry 4712 (class 2606 OID 16630)
-- Name: EmployeeRoles EmployeeRoles_SystemUsers_ModifiedBy_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmployeeRoles"
    ADD CONSTRAINT "EmployeeRoles_SystemUsers_ModifiedBy_fk" FOREIGN KEY ("ModifiedBy") REFERENCES public."Users"("UserId") NOT VALID;


--
-- TOC entry 4707 (class 2606 OID 16550)
-- Name: SystemUsers SystemUsers_EmployeeRoles_EmployeeRoleId_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemUsers"
    ADD CONSTRAINT "SystemUsers_EmployeeRoles_EmployeeRoleId_fk" FOREIGN KEY ("EmployeeRoleId") REFERENCES public."EmployeeRoles"("EmployeeRoleId") NOT VALID;


--
-- TOC entry 4708 (class 2606 OID 16460)
-- Name: SystemUsers SystemUsers_UserRoles_UserRoleId_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemUsers"
    ADD CONSTRAINT "SystemUsers_UserRoles_UserRoleId_fk" FOREIGN KEY ("UserRoleId") REFERENCES public."UserRoles"("UserRoleId");


--
-- TOC entry 4709 (class 2606 OID 16455)
-- Name: SystemUsers SystemUsers_Users_UserId_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemUsers"
    ADD CONSTRAINT "SystemUsers_Users_UserId_fk" FOREIGN KEY ("UserId") REFERENCES public."Users"("UserId");


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE "UserRoles"; Type: ACL; Schema: public; Owner: postgres
--

-- Create the APIAccessRole user with a password
CREATE ROLE "{{DB_USER}}" WITH LOGIN PASSWORD '{{DB_PASSWORD}}';

-- Grant privileges to the APIAccessRole user
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public."UserRoles" TO "{{DB_USER}}";


-- Completed on 2025-03-31 19:16:45

--
-- PostgreSQL database dump complete
--

