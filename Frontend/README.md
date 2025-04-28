# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# NOTES

1. Passing data between parent and child :->

```ts
// parent.component.ts
@Component({
imports: [ChildComponent]
})

//parent.component.html
<app-child [inheritedVariable] = "'Hello from parent!!'">

// child.component.ts
class ChildComponent {
    inheritedVariable = input('Default Value');
}

//child.component.html
{{ inheritedVariable() }}



// more!!!
// input -> receive from parent
val = input("Default value");
val = input.required();

// output -> give to parent
oval = output<Object>();
someFunction () {
    oval.emit(newValue);
}


<app-child [val] = val (oval)="changeinChildItem($event)" /> // $event -> is of type object
// parent component
originalObject = signal<Object>(value);
changeinChildItem(val: Object) {
    this.originalObject.update(val);
}
```

2. Event listners:->

```ts
// html
<input id="numero-{{item.id}}" type="text" (keyup)="handlerFunction($event)" [value]="myVariable()"/>
<button (click)="myButtonHandler()" />
// js
class Component {
    handlerFunction(event: KeyboardEvent) {
        console.log(event.key);
    }
}
```

3. Signal :->

```ts
val = signal<Integer>(0);
val = signal(0);
this.val.set(3);
this.val.update((v) => v + 1);
```

4. SERVICES:->

```ts
// for providing a service just to a single component :->
// remove providedIn: 'root' from service and then add providers: [ServiceName] in the metadata of the specified component

// component
service = inject(myService);
this.service.myGetDataFunction();
```

5. USEEFFECT:->

```ts
class MyComponent implements OnInit {
  ngOnInit(): void {}
}
```

6. HTTP:->

```ts
// 1. in app.config.ts add in providers:
provideHttpClient()

// 2. in component/service
http = inject(HttpClient)

getFromApi() {
    return this.http.get<Array<Item>>(url);
}

// 3.
service = inject(myService)
items = signal<Array<Item>>();
ngOnInit() : void {

    this.service.getFromApi()
    .pipe(
        catchError((err) => {
            console.log(err);
            throw err;
        })
        .subscribe((data) => {
            this.items.set(data)
        })
    )
}
```

7. DIRECTIVES (DOM MANIPULATION)

```ts
imports: [NgIf]
<p *ngIf="!dataLoaded()"> Loading... </p> // ! PREFER @If

class MyDirective{
    completed = signal<Boolean>(false);
    el = inject(ElementRef)
    styleChange = effect(() => {
        if(completed) this.el.nativeElement.style.color = "#FFFFFF"
    })
}

// html
<p appMyDirective [completed]="item.status">

```
