package org.example.dat251project.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Request DTO for signing inn as a staff or administrator",
        requiredProperties = {"name", "password"})
public class UserDTO {
    @Schema(description = "The name of the user", format = "String", example = "staff")
    @NotNull
    private String name;
    @NotNull
    @Schema(description = "The password related to the user", format = "String", example = "staff123")
    private String password;
}
