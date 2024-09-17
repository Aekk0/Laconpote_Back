// Import Third-party Dependencies
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { Picture } from "./picture.entity";
import { Order } from "./order.entity";

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
    @OneToMany(() => Picture, (picture) => picture.product, { nullable: true })
    pictures: Picture[];

    @ManyToMany(() => Order, (order) => order.products, { nullable: true })
    orders: Order[];
}