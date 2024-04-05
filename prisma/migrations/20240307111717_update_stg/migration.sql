/*
  Warnings:

  - The values [APROVADO,NO_APROVADO] on the enum `Propuesta_estado` will be removed. If these variants are still used in the database, this will fail.
  - The values [APROVADO,NO_APROVADO] on the enum `SolicitudTrabajoGrado_estado` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Propuesta` MODIFY `estado` ENUM('APROBADO', 'PENDIENTE', 'CAMBIOS', 'NO_APROBADO') NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE `SolicitudTrabajoGrado` MODIFY `estado` ENUM('APROBADO', 'PENDIENTE', 'NO_APROBADO') NOT NULL DEFAULT 'PENDIENTE';
