/*
  Warnings:

  - Made the column `propuestaId` on table `SolicitudTrabajoGrado` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `SolicitudTrabajoGrado` MODIFY `propuestaId` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `cloudinaryId` VARCHAR(191) NOT NULL DEFAULT '',
    `originalName` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `File_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SolicitudTrabajoGrado` ADD CONSTRAINT `SolicitudTrabajoGrado_propuestaId_fkey` FOREIGN KEY (`propuestaId`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
