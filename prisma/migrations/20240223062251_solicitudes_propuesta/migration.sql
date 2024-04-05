/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `SolicitudTrabajoGrado` (
    `id` VARCHAR(191) NOT NULL,
    `propuestaId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `justificacion` VARCHAR(191) NOT NULL DEFAULT '',
    `estado` ENUM('APROVADO', 'PENDIENTE', 'NO_APROVADO') NOT NULL DEFAULT 'PENDIENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SolicitudTrabajoGrado_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Propuesta` (
    `id` VARCHAR(191) NOT NULL,
    `solicitudTrabajoGradoId` VARCHAR(191) NOT NULL,
    `comiteId` VARCHAR(191) NOT NULL,
    `justificacion` VARCHAR(191) NOT NULL DEFAULT '',
    `propuesta` VARCHAR(191) NOT NULL DEFAULT '',
    `estado` ENUM('APROVADO', 'PENDIENTE', 'CAMBIOS', 'NO_APROVADO') NOT NULL DEFAULT 'PENDIENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Propuesta_id_key`(`id`),
    UNIQUE INDEX `Propuesta_solicitudTrabajoGradoId_key`(`solicitudTrabajoGradoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SolicitudTrabajoGrado` ADD CONSTRAINT `SolicitudTrabajoGrado_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Propuesta` ADD CONSTRAINT `Propuesta_solicitudTrabajoGradoId_fkey` FOREIGN KEY (`solicitudTrabajoGradoId`) REFERENCES `SolicitudTrabajoGrado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
