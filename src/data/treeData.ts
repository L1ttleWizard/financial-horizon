// src/data/treeData.ts

export interface TreeStage {
    stage: number;
    imagePath: string;
    minNetWorth: number; // Минимальный чистый капитал для этой стадии
}

export const treeData: TreeStage[] = [
    { stage: 0, imagePath: '/tree/stage-1.png', minNetWorth: -Infinity },
    { stage: 1, imagePath: '/tree/stage-2.png', minNetWorth: 0 },
    { stage: 2, imagePath: '/tree/stage-3.png', minNetWorth: 41000 },
    { stage: 3, imagePath: '/tree/stage-4.png', minNetWorth: 123000 },
];

// Вспомогательная функция, которая определяет стадию дерева по капиталу
export const getTreeStageForNetWorth = (netWorth: number): TreeStage => {
    // Идем с конца (от самого большого к самому маленькому), чтобы найти первую подходящую стадию
    for (let i = treeData.length - 1; i >= 0; i--) {
        if (netWorth >= treeData[i].minNetWorth) {
            return treeData[i];
        }
    }
    return treeData[0]; // По умолчанию возвращаем самую первую стадию
};