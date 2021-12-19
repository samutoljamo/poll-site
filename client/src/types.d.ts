interface Option{
    votes: number,
    name: string,
    optid: number
}
type OptionInfo = Omit<Option, "votes">;

interface Poll{
    name: string,
    options: Option[]
}
interface PollInfo extends Omit<Poll, "options">{
    options: OptionInfo[],
    _id: string
}
