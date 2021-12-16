interface Option{
    votes: number,
    name: string,
    id: number
}
type OptionInfo = Omit<Option, "votes">;

interface Poll{
    name: string,
    options: Option[]
}
interface PollInfo extends Omit<Poll, "options">{
    options: OptionInfo[],
    id: number
}
