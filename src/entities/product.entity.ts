// Import Third-party Dependencies
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { Picture } from "./picture.entity";

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