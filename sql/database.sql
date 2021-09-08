create table products(
    `id` int unsigned not null auto_increment,
    `title` varchar(255) not null,
    `price` double not null,
    `description` text not null,
    `image_url` varchar(255) not null,
    PRIMARY KEY(`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);
