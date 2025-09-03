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

// Computed Signals (readonly signals whose value is derived from other signals) following are some usecases
// applying filters, switching tabs/ui, derived info, disabled state etc
computed(() => mySingal().filter(/*..*/));
```

4. SERVICES:->

```ts
// for providing a service just to a single component :->
// remove providedIn: 'root' from service and then add providers: [ServiceName] in the metadata of the specified component

// component
service = inject(myService);
this.service.myGetDataFunction();
```

5. USEFFECT:->

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

8. FORM

- # creates a template reference variable — a way to get a handle on a DOM element or Angular directive from within the template.

```html
<input #usernameInput /> <button (click)="log(usernameInput.value)">Log Username</button>
```

- | Syntax      | Meaning                                | Example                           |
  | ----------- | -------------------------------------- | --------------------------------- |
  | `[]`        | Property Binding                       | `[src]="imageUrl"`                |
  | `()`        | Event Binding                          | `(click)="handleClick()"`         |
  | `[(...)]`   | Two-Way Binding (banana-in-a-box 🍌📦) | `[(ngModel)]="user.name"`         |
  | No brackets | Static attribute / directive           | `required`, `disabled`, `ngModel` |

- 🟡 What’s the difference between minlength and [minlength]?
  ✳️ minlength (no brackets)

      This is a static HTML attribute.

      The value must be a string.

```html
<input minlength="4" />
<!-- always 4 -->
```

✳️ [minlength] (with brackets)

    This is a dynamic Angular binding.

    You bind it to a variable or expression.

```html
<input [minlength]="minLengthValue" />
```

Use [minlength] only if you want to set it dynamically based on a variable.

9. Ng-content, template and container

- ng-content: passing html from parent to child

```html
<!-- parent.html -->
<app-child>
  <p>This is parent html</p>
  <!-- via a dummy attr -->
  <p channelName="channel1">This is parent html</p>
  <!-- via class -->
  <p class="channel">This is parent html</p>
</app-child>

<!-- child.html -->
<div>
  <ng-content />
  <ng-content select="channel1" />
  <ng-content select=".channel" />
</div>
```

- ng-container : useful for nesting of ng control statements ( eg: *ngFor, *ngIf, etc)

```html
<!-- not allowed to use ngIf in the same div as below -->
<div *ngFor="let number of numbers">
  <ng-container *ngIf="number % 2 == 0"> {{ number }} </ng-container>
</div>
```

- ng-template: reference to a group of html elements its usefull because it doesnt add an extra div

```html
<!-- normal way to do it -->
 <div *ngIf="mobileView"> <p> This is a mobile component </p> </div>

 <!-- after rendering on dom it becomes  -->
 <!-- <div> <p> This is a mobile component </p> </div> -->

  <!-- with ng-template -->
  <ng-template [ngIf]="mobileView"> <p> This is a mobile component </p> </div>

  <!-- after rendering it becomes  -->
  <!-- <p> This becomes a mobile component </p> -->
```

10. CSS height inheritance problem

- solved by making parent 1 dvh, then a series of flex and flex-grow = 1 to make the center main content div to be take remaining of 100% size. h-full doesnt work

// css
transparent text
bg-white text-black mix-blend-screen

observable.subscribe() means "give me any amount of values, either synchronously or asynchronously"

this is standard behavior because Jackson, following JavaBean conventions, serializes boolean getters named isAdmitted() as the JSON property "admitted" (drops the "is" prefix).

// SPRING
For simple suppression: @JsonIgnore

    For breaking bi-directional reference loops: @JsonManagedReference (parent and in OneToOne the non-owning side i.e mappedBy side) + @JsonBackReference (child and in onetoone its owning side whihc actually has the fk)

// mention all routes (API STRUCTURE)
