// Import Third-party Dependencies
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { User } from "./user.entity";
import { Address } from "./address.entity";
import { stage } from "./enum";
import { OrderProduct } from "./orderProduct.entity";
import { Provider } from "./provider.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("decimal")
    price: number;

    @Column("enum", { enum: stage, default: stage.awaiting })
    stage: stage;

    @Column("timestamp", { nullable: true })
    dueDate: Date;

    // FK
    @ManyToOne(() => User, (table) => table.orders, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;
    @Column("integer", { nullable: false })
    user_id: number;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, { cascade: true })
    orderProducts: OrderProduct[];

    @ManyToOne(() => Address, (table) => table.orders, { nullable: false })
    @JoinColumn({ name: "address_id" })
    address: Address;
    @Column("integer", { nullable: false })
    address_id: number;

    @ManyToOne(() => Provider, (table) => table.orders, { nullable: false })
    @JoinColumn({ name: "provider_id" })
    provider: Provider;
    @Column("integer", { nullable: false })
    provider_id: number;
}