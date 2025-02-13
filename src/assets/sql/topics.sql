/* 第一版 CREATE TABLE `topics` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `content_template_id` BIGINT UNSIGNED NOT NULL,
    `article_type_id` BIGINT UNSIGNED NOT NULL,
    `language_style_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`content_template_id`) REFERENCES `content_templates` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`article_type_id`) REFERENCES `article_types` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`language_style_id`) REFERENCES `language_styles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 */
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `topics`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `topics` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `content_template_id` BIGINT UNSIGNED DEFAULT NULL,  -- 允许为空
    `article_type_id` BIGINT UNSIGNED DEFAULT NULL,  -- 允许为空
    `language_style_id` BIGINT UNSIGNED DEFAULT NULL,  -- 允许为空
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`content_template_id`) REFERENCES `content_templates` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`article_type_id`) REFERENCES `article_types` (`id`) ON DELETE SET NULL,
    FOREIGN KEY (`language_style_id`) REFERENCES `language_styles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
