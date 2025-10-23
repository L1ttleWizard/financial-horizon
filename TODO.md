1. обязательные траты еда квартира там = done
2. проработать варианты проигрыша = done
3. цвет в погашении долга  = done
4. добавить кнопку положить какую то сумму с баланса в сбережения и выбрать в какой банк положить деньги на какой процент и на какой срок, добавить отдельную страничку сбережений по клику на вкладку сбережений, там указать какие предложения доступны на данный момент, и сколько денег лежит у тебя сейчас, и по истечении срока вкладов класть накопленные деньги - done
5. добавить процент кредита на главный экран и сколько тебе накапало денег за каждый месяц - done
7. игра должна требовать через каждые 4 хода прочитать глоссарий чтобы обучиться (попап без права закрытия) - done
6. readme = done
9. добавить дисклеймер при старте игры (онбординг) = done 
расшишить пул событий = done
добавить firebase auth, хранить стейт игры в бд, синхронизировать с localStorage = done
лидерборд = done

8. добавить интерактивные ивенты в неделю, чтобы в модалке можно было условно при выборе покрутить слоты или воздеражаться при выборе покрутить слоты крутить слоты = testing


добавить в начале игры хард изи и мидл посредством имзменения системных переменных процентой ставки
подумать над генерацией вариантов и фоток
проработать дизайн и фотки
сделать админку с помощью firebase чтобы можно было добавлять или администрировать варианты через нее   
подумать над процентными ставками, может пересчитать в проценты месячных а не годовых
возможно хранить фотки и события в firebase
сделать чтобы работало без инета


сделать задний фон градиентным=done 
покрасить разными цветами плашки баланса, настроения, сбережения, долга = done
сделать стрелку назад или подсветить ссылку для тупых=done
хедер съезжает при переходе на таблицу лидеров=done
надо сделать в полях регистрации никнейм, подтверждение пароля, сделать глазик, чтобы можно было посмотреть введенные пароли, проверить пароли на соответствие друг другу, сделать чтобы никнейм отображался в профиле и в лидер борде, проверить ник на уникальность в бд = done
доработать страницу  аккаунт, дать возможность менять никнейм пароль и удалять аккаунт=done
убрать пустоты по бокам - денежное дерево переместить влево на сайдбар,  достижения справа на сайдбар   сделать базовую раскладку для full hd по ширине, а для широких экранов сделать адаптивную = done
пофиксить обновление таблицы лидеров, после удаления аккаунтов дублируется запись = done
перевести в рубли = done

при наведении на плашки сделать что-нибудь чтобы было   


localstate должен синхронизироваться с firebase

1. кнопки управления игрой переместить влево в сайдбар -done
2. сделать скругление  везде одинаковое - done
3. маскот другой придумать -----------
4. дерево перенести в правый сайдбар сделать анимацию дерева при переходе на новую неделю, если оно поменялось -----------------
5. в хедере заменить текст таблица лидеров на иконку таблицы лидеров и кнопку аккаунт заменить на иконку аккаунт - done
6. достижения оставить в правом сайдбаре, сделать по умолчанию свернутыми, но чтобы показывалось только 1 последнее полученное  достижение - done
7. во всех модалках сделать задний фон таким какой он на главной странице - done
8. плашка долг: убрать кнопку погасить долг, сделать чтобы при наведении появлялась  надпить погасить долг в общем дизайне - done
9. заменить в плашке настроения сердечко на разные эмодзи в зависимости от количества настроения, вынести управление эмодзи в отдельный файл, как сделано с gameData - done
10. разделить разряды нулей в суммах, допустим заменять 10000Р на 10 000Р -done
11. заменить текстовые иконки в плашках на главной странице на иконки из react icons, сделать их побольше ---------

https://nextjs.org/telemetry
   ▲ Next.js 15.5.4
   Creating an optimized production build ...
<w> [webpack.cache.PackFileCacheStrategy] Skipped not serializable cache item 'Compilation/modules|/home/runner/work/***/***/node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[2]!/home/runner/work/***/***/node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[3]!/home/runner/work/***/***/src/app/globals.css': No serializer registered for Warning
<w> while serializing webpack/lib/cache/PackFileCacheStrategy.PackContentItems -> webpack/lib/NormalModule -> Array { 2 items } -> webpack/lib/ModuleWarning -> Warning
 ⚠ Compiled with warnings in 5.8s
./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[3]!./src/app/globals.css
Warning
(2:28012) autoprefixer: Gradient has outdated direction syntax. New syntax is like `closest-side at 0 0` instead of `0 0, closest-side`.
Import trace for requested module:
./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[3]!./src/app/globals.css
./src/app/globals.css
./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[3]!./src/app/globals.css
Warning
(2:28125) autoprefixer: Gradient has outdated direction syntax. New syntax is like `closest-side at 0 0` instead of `0 0, closest-side`.
Import trace for requested module:
./src/app/globals.css.webpack[javascript/auto]!=!./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[2]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[14].oneOf[10].use[3]!./src/app/globals.css
./src/app/globals.css
 ✓ Compiled successfully in 14.9s
   Linting and checking validity of types ...
./src/app/page.tsx
28:7  Warning: 'basePath' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/components/game/AchievementsWidget.tsx
3:8  Warning: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
21:9  Warning: 'latestAchievement' is assigned a value but never used.  @typescript-eslint/no-unused-vars
./src/components/game/MascotWidget.tsx
6:9  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules