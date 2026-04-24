"use client";

import {CSSProperties} from "react";
import {FaEnvelope, FaKey} from "react-icons/fa";
import {SubmitHandler, useForm} from "react-hook-form";

import z from "zod";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";

const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true

})
const loginSchema = z.object({
    name: z.string(),
    password: z.string()
});

type LoginType = z.infer<typeof loginSchema>;
export default function Page() {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginType>({
        resolver: zodResolver(loginSchema),
    });

    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (userData: LoginType) => {
            return apiClient.post("http://localhost:8080/users/login", userData);
        },
        onSuccess: (response) => {
            router.push("/dashboard")
        }
    });
    const onSubmit: SubmitHandler<LoginType> = (data) => {
        mutation.mutate(data)
    };
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Logo */}
                <img
                    src="/logo_black.png"
                    style={{
                        width: 120,
                        margin: "0 auto 10px",
                        display: "block",
                    }}
                />
                {(errors.name || errors.password) &&
                    <span className={"text-red-800"}>Ugyldig brukerlegitimasjon</span>}
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <div style={styles.inputWrapper}>
                        <FaEnvelope style={styles.icon}/>
                        <input
                            placeholder="name"
                            {...register("name")}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputWrapper}>
                        <FaKey style={styles.icon}/>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles: Record<string, CSSProperties> = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(135deg, #c7a57a 0%, #8b2e1e 100%)",
    },
    card: {
        backgroundColor: "#e9e9e9",
        padding: 30,
        borderRadius: 12,
        width: 320,
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    },
    logo: {
        fontWeight: "bold",
        color: "#b30000",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 15,
    },
    inputWrapper: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ddd",
        borderRadius: 6,
        padding: "8px 10px",
    },
    icon: {
        marginRight: 8,
        fontSize: 14,
    },
    input: {
        border: "none",
        outline: "none",
        background: "transparent",
        flex: 1,
        fontSize: 14,
    },
    button: {
        marginTop: 10,
        padding: 10,
        borderRadius: 6,
        border: "none",
        backgroundColor: "#c7a57a",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    },
};