// Import Third-party Dependencies
import { BaseEntity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { User } from "./user.entity";

export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column("boolean", { default: false })
    refresh: boolean;

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    dateStart: string;

    // FK
    @OneToOne(() => User, (table) => table.session, { nullable: true })
    @JoinColumn({ name: "user_id" })
    user: User;
    @Column("number", { nullable: false })
    userId: number;
}