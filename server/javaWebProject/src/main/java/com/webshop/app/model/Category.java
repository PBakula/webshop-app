package com.webshop.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDCategory")
    private int id;

    @Column(name = "Name", nullable = false, length = 255)
    private String name;

    @Column(name = "Image", columnDefinition = "TEXT")
    private String image;
}
