// Import Third-party Dependencies
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// Import Internals
import { User } from "./user.entity";

@Entity()
export class Session {
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
    @Column("int", { nullable: false })
    userId: number;
}