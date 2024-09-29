// Import Third-party Dependencies
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { Picture } from "./picture.entity";
import { Order } from "./order.entity";
import { OrderProduct } from "./orderProduct.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    name: string;

    @Column("text", { nullable: true })
    description: string;

    @Column("decimal")
    price: number;

    // RELATIONS
    @OneToMany(() => Picture, (picture) => picture.product, { nullable: true })
    pictures: Picture[];

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
    orderProducts: OrderProduct[];
}