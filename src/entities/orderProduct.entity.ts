import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    quantity: number;

    @ManyToOne(() => Product, (product) => product.orderProducts, { onDelete: "CASCADE" })
    product: Product;

    @ManyToOne(() => Order, (order) => order.orderProducts, { onDelete: "CASCADE" })
    order: Order;
}