import React from 'react';
import MonacoEditor from 'react-monaco-editor'

const code =
`#include <stdio.h>

int main()
{
    int a, b, c;
    printf("Enter the first value:");
    scanf("%d", &a);
    printf("Enter the second value:");
    scanf("%d", &b);
    c = a + b;
    printf("%d + %d = %d", a, b, c);
    return 0;
}

`
export default class SimpleMonacoEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: props.width,
            code: props.initialCode
        }
    }

    
    onChange(newValue, e) {
        console.log('onCodeChange', newValue, e);
        this.props.onCodeChange(newValue);
    }

    render() {
        const {language} = this.props;
        return (
            <MonacoEditor
                width={this.props.width}
                // height="800"
                language={language}
                theme="vs-dark"
                defaultValue=''
                value={this.state.code}
                onChange={this.onChange}
            />
        )
    }
}