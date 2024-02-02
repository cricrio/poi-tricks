interface Props {
    externalId: string;
}
export function YoutubeEmbed({ externalId }: Props) {
    return (
        <div className="relative">
            <iframe
                title={"YouTube video player"}
                className="aspect-video w-full max-w-2xl rounded-2xl"
                src={`https://www.youtube.com/embed/${externalId}`}
            />
        </div>
    );
}
