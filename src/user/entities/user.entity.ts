import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
    })
    name: string;

    @Column({
        type: 'varchar',
        unique: true,
        nullable: false,
        length: 150,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255, // for hashed password
        nullable: false,
    })
    passwordHash: string;


    @Column({
        type: "number",
        nullable: true,
    })
    age: number;

    @Column({ type: 'float', nullable: true })
    heightCm: number; // cm

    @Column({ type: 'float', nullable: true })
    weightKg: number; // kg

    @Column({
        type: "boolean"
    })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}