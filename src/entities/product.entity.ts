// Import Third-party Dependencies
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

// Import Internals
import { Picture } from "./picture.entity";

// @Unique("UQ_user_email", ["email"])
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: string;

    @Column("varchar")
    name: string;

    @Column("text", { nullable: true })
    description: string;

    @Column("decimal")
    price: number;

    // RELATIONS
    @OneToMany (() => Picture, (picture) => picture.product, { nullable: true })
    pictures: Picture[];
}