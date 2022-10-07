create schema nhl_stat_pipeline;

create type nhl_stat_pipeline."player_position" as enum (
    'Center',
    'Defenseman',
    'Goalie',
    'Left Wing',
    'Right Wing',
    'Unknown'
);

create type nhl_stat_pipeline."play_type" as enum (
    'Assist',
    'Goal',
    'Hit',
    'Penalty Minues'
);

create table nhl_stat_pipeline.teams(
    team_id bigint primary key,
    "name" varchar(200) not null,
    "location" varchar(200) not null
);

create table nhl_stat_pipeline.players(
    player_id bigint primary key,
    first_name varchar(200) not null,
    last_name varchar(200) not null,
    "age" int null,
    "number" int null,
    "position" nhl_stat_pipeline.player_position not null,
    team_id bigint references nhl_stat_pipeline.teams(team_id) on delete cascade
);

create table nhl_stat_pipeline.games(
    game_id bigint primary key,
    home_team_id bigint references nhl_stat_pipeline.teams(team_id),
    away_team_id bigint references nhl_stat_pipeline.teams(team_id),
    game_date date not null
);

create table nhl_stat_pipeline.plays(
    play_id serial primary key,
    game_id bigint references nhl_stat_pipeline.games(game_id),
    "time_stamp" timestamp not null
);

create table nhl_stat_pipeline.play_stats(
    play_stats_id serial primary key,
    play_id bigint references nhl_stat_pipeline.plays(play_id),
    player_id bigint references nhl_stat_pipeline.players(player_id),
    play_type nhl_stat_pipeline.play_type not null,
    point_value int not null default 0
);

insert into
    nhl_stat_pipeline.teams(team_id, "name", "location")
VALUES
    (1, 'Devils', 'New Jersey'),
    (2, 'Islanders', 'New York'),
    (3, 'Rangers', 'New York'),
    (4, 'Flyers', 'Philadelphia'),
    (5, 'Penguins', 'Pittsburgh'),
    (6, 'Bruins', 'Boston'),
    (7, 'Sabres', 'Buffalo'),
    (8, 'Canadiens', 'Montréal'),
    (9, 'Senators', 'Ottawa'),
    (10, 'Maple Leafs', 'Toronto'),
    (12, 'Hurricanes', 'Carolina'),
    (13, 'Panthers', 'Florida'),
    (14, 'Lightning', 'Tampa Bay'),
    (15, 'Capitals', 'Washington'),
    (16, 'Blackhawks', 'Chicago'),
    (17, 'Red Wings', 'Detroit'),
    (18, 'Predators', 'Nashville'),
    (19, 'Blues', 'St. Louis'),
    (20, 'Flames', 'Calgary'),
    (21, 'Avalanche', 'Colorado'),
    (22, 'Oilers', 'Edmonton'),
    (23, 'Canucks', 'Vancouver'),
    (24, 'Ducks', 'Anaheim'),
    (25, 'Stars', 'Dallas'),
    (26, 'Kings', 'Los Angeles'),
    (28, 'Sharks', 'San Jose'),
    (29, 'Blue Jackets', 'Columbus'),
    (30, 'Wild', 'Minnesota'),
    (52, 'Jets', 'Winnipeg'),
    (53, 'Coyotes', 'Arizona'),
    (54, 'Golden Knights', 'Vegas'),
    (55, 'Kraken', 'Seattle');