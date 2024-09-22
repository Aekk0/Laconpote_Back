// Import Third-party Dependencies
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { User } from "./user.entity";
import { Product } from "./product.entity";
import { Address } from "./address.entity";
import { stage } from "./enum";

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
    userId: number;

    @ManyToMany(() => Product, (table) => table.orders, { nullable: false })
    @JoinTable()
    products: Product[];

    @ManyToOne(() => Address, (table) => table.orders, { nullable: false })
    address: Address;
}