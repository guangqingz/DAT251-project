import Container from "@/app/ui/Container";

export default function Page () {
    return (
        <section className={"bg-custom-eggwhite min-h-[70dvh] h-full"}>
            <Container style={"flex flex-col items-center h-full justify-center gap-10"}>
                <h1 className={"text-3xl lg:text-5xl"}>Vår meny</h1>
                <a className={"default-btn lg:text-xl font-title bg-custom-red border-custom-red text-white hover:bg-custom-eggwhite hover:text-custom-red"}>Les menyen her</a>
            </Container>
        </section>
    )
}