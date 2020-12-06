import {Button} from './styles';

interface Letter{
    value: string,
    disabled: boolean,
    onClick?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined,
}

const Letter: React.FC<Letter> = ({ value, ...rest }: Letter) => {

    return (
        <Button {...rest}>{value}</Button>
    )
}

export default Letter;