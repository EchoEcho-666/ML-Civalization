-- ML Civilization personal research graph schema.
-- Run this in a Supabase project owned by you. Never reuse another site's project keys.

create extension if not exists "pgcrypto";

create table if not exists public.research_nodes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  local_id text not null,
  node_type text not null check (node_type in ('paper','concept','problem','mechanism','open-question','contradiction','research-idea')),
  title text not null,
  year integer,
  status text not null,
  position_x double precision not null default 0,
  position_y double precision not null default 0,
  doi text,
  external_id text,
  source_url text,
  pdf_url text,
  data_source text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id),
  unique nulls not distinct (owner_id, doi)
);

create table if not exists public.research_edges (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  local_id text not null,
  source_local_id text not null,
  target_local_id text not null,
  edge_type text not null,
  explanation text not null default '',
  provenance text not null default 'human' check (provenance in ('human','citation','imported','generated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id)
);

create table if not exists public.research_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  node_local_id text not null,
  body text not null default '',
  updated_at timestamptz not null default now(),
  unique (owner_id, node_local_id)
);

alter table public.research_nodes enable row level security;
alter table public.research_edges enable row level security;
alter table public.research_notes enable row level security;

create policy "owners manage nodes" on public.research_nodes
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage edges" on public.research_edges
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners manage notes" on public.research_notes
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index if not exists research_nodes_owner_idx on public.research_nodes(owner_id);
create index if not exists research_nodes_doi_idx on public.research_nodes(doi);
create index if not exists research_edges_owner_source_idx on public.research_edges(owner_id, source_local_id);
create index if not exists research_edges_owner_target_idx on public.research_edges(owner_id, target_local_id);
